import json
import sys
import xml.etree.ElementTree as ET
from html import escape
from pathlib import Path


BOOK_NAMES = {
    "Gen": "Genesis",
    "Exod": "Exodus",
    "Lev": "Leviticus",
    "Num": "Numbers",
    "Deut": "Deuteronomy",
    "Josh": "Joshua",
    "Judg": "Judges",
    "Ruth": "Ruth",
    "1Sam": "1 Samuel",
    "2Sam": "2 Samuel",
    "1Kgs": "1 Kings",
    "2Kgs": "2 Kings",
    "1Chr": "1 Chronicles",
    "2Chr": "2 Chronicles",
    "Ezra": "Ezra",
    "Neh": "Nehemiah",
    "Esth": "Esther",
    "Job": "Job",
    "Ps": "Psalms",
    "Prov": "Proverbs",
    "Eccl": "Ecclesiastes",
    "Song": "Song of Solomon",
    "Isa": "Isaiah",
    "Jer": "Jeremiah",
    "Lam": "Lamentations",
    "Ezek": "Ezekiel",
    "Dan": "Daniel",
    "Hos": "Hosea",
    "Joel": "Joel",
    "Amos": "Amos",
    "Obad": "Obadiah",
    "Jonah": "Jonah",
    "Mic": "Micah",
    "Nah": "Nahum",
    "Hab": "Habakkuk",
    "Zeph": "Zephaniah",
    "Hag": "Haggai",
    "Zech": "Zechariah",
    "Mal": "Malachi",
    "Matt": "Matthew",
    "Mark": "Mark",
    "Luke": "Luke",
    "John": "John",
    "Acts": "Acts",
    "Rom": "Romans",
    "1Cor": "1 Corinthians",
    "2Cor": "2 Corinthians",
    "Gal": "Galatians",
    "Eph": "Ephesians",
    "Phil": "Philippians",
    "Col": "Colossians",
    "1Thess": "1 Thessalonians",
    "2Thess": "2 Thessalonians",
    "1Tim": "1 Timothy",
    "2Tim": "2 Timothy",
    "Titus": "Titus",
    "Phlm": "Philemon",
    "Heb": "Hebrews",
    "Jas": "James",
    "1Pet": "1 Peter",
    "2Pet": "2 Peter",
    "1John": "1 John",
    "2John": "2 John",
    "3John": "3 John",
    "Jude": "Jude",
    "Rev": "Revelation",
}


SKIP_TAGS = {"note", "title", "header", "revisionDesc", "work", "reference", "caption"}


class VerseBuilder:
    def __init__(self):
        self.book_id = None
        self.chapter = None
        self.verse = None
        self.chunks = []

    def start(self, osis_id):
        book_id, chapter, verse = osis_id.split(".")
        self.book_id = book_id
        self.chapter = int(chapter)
        self.verse = int(verse)
        self.chunks = []

    def add_text(self, text, *, red, italic):
        if not text:
            return
        if self.chunks and self.chunks[-1][:2] == (red, italic):
            self.chunks[-1] = (red, italic, self.chunks[-1][2] + text)
        else:
            self.chunks.append((red, italic, text))

    def finish(self):
        text = "".join(chunk[2] for chunk in self.chunks)
        verse = {"verse": self.verse, "text": text}

        if any(red or italic for red, italic, _ in self.chunks):
            html_parts = []
            for red, italic, chunk_text in self.chunks:
                classes = []
                if red:
                    classes.append("verse-red-letter")
                if italic:
                    classes.append("verse-added-words")
                escaped = escape(chunk_text, quote=False)
                if classes:
                    html_parts.append(
                        f'<span class="{" ".join(classes)}">{escaped}</span>'
                    )
                else:
                    html_parts.append(escaped)
            verse["html"] = "".join(html_parts)

        return self.book_id, self.chapter, verse


def append_text(state, builder, text):
    if builder.verse is None or not text:
        return
    builder.add_text(
        text,
        red=state["red_depth"] > 0,
        italic=state["italic_depth"] > 0,
    )


def walk(node, state, builder, books):
    tag = node.tag.split("}")[-1]

    if tag == "verse":
        osis_id = node.attrib.get("osisID")
        if "sID" in node.attrib and osis_id and osis_id.count(".") == 2:
            builder.start(osis_id)
        elif "eID" in node.attrib and builder.verse is not None:
            book_id, chapter, verse = builder.finish()
            book_name = BOOK_NAMES[book_id]
            chapters = books.setdefault(book_name, [])
            while len(chapters) < chapter:
                chapters.append({"chapter": len(chapters) + 1, "verses": []})
            chapters[chapter - 1]["verses"].append(verse)
            builder.verse = None
            builder.chunks = []
        return

    if tag in SKIP_TAGS:
        return

    pushed_red = False
    pushed_italic = False

    if tag == "q" and node.attrib.get("who") == "Jesus":
        state["red_depth"] += 1
        pushed_red = True
    elif tag == "transChange" and node.attrib.get("type") == "added":
        state["italic_depth"] += 1
        pushed_italic = True

    append_text(state, builder, node.text)
    for child in node:
        walk(child, state, builder, books)
        append_text(state, builder, child.tail)

    if pushed_italic:
        state["italic_depth"] -= 1
    if pushed_red:
        state["red_depth"] -= 1


def convert(xml_path, output_path):
    root = ET.parse(xml_path).getroot()
    books = {}
    builder = VerseBuilder()
    state = {"red_depth": 0, "italic_depth": 0}

    for book in root.iter():
        if book.tag.split("}")[-1] != "div":
            continue
        if book.attrib.get("type") != "book" or book.attrib.get("canonical") != "true":
            continue
        book_id = book.attrib.get("osisID")
        if book_id not in BOOK_NAMES:
            continue
        for child in book:
            walk(child, state, builder, books)

    output_path.write_text(
        "window.KJV_BIBLE = " + json.dumps(books, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


def main(argv):
    if len(argv) != 3:
        raise SystemExit("Usage: python convert_crosswire_kjv.py <input.xml> <output.js>")
    convert(Path(argv[1]), Path(argv[2]))


if __name__ == "__main__":
    main(sys.argv)
