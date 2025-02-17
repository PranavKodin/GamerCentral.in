import sys
import time
import requests
import keyboard
from PyQt5.QtWidgets import QApplication, QRubberBand, QMainWindow
from PyQt5.QtCore import Qt, QRect, QPoint
from PyQt5.QtGui import QPixmap, QGuiApplication

class SnippingTool(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint)
        self.setWindowOpacity(0.3)  # Semi-transparent overlay
        screen = QGuiApplication.primaryScreen().geometry()
        self.setGeometry(screen)  # Fullscreen overlay

        self.origin = QPoint()
        self.rubberBand = QRubberBand(QRubberBand.Rectangle, self)
        self.selection_done = False  # Flag to check selection status
        self.show()

    def mousePressEvent(self, event):
        self.origin = event.pos()
        self.rubberBand.setGeometry(QRect(self.origin, self.origin))
        self.rubberBand.show()

    def mouseMoveEvent(self, event):
        if self.rubberBand.isVisible():
            self.rubberBand.setGeometry(QRect(self.origin, event.pos()).normalized())

    def mouseReleaseEvent(self, event):
        self.captureScreenshot()
        self.selection_done = True
        self.close()

    def captureScreenshot(self):
        rect = self.rubberBand.geometry()
        if rect.width() > 10 and rect.height() > 10:  # Ensure valid selection
            screenshot = QGuiApplication.primaryScreen().grabWindow(
                0, rect.x(), rect.y(), rect.width(), rect.height()
            )
            screenshot.save("screenshot.png")
        else:
            print("Selection too small. Try again!")


def get_text_from_image():
    api_key = "K84179819588957"  # Replace with your OCR.space API key
    image_path = "screenshot.png"

    with open(image_path, "rb") as image_file:
        response = requests.post(
            "https://api.ocr.space/parse/image",
            files={"image": image_file},
            data={"apikey": api_key, "language": "eng"},
        )

    text = response.json().get("ParsedResults", [{}])[0].get("ParsedText", "")

    # Convert text into a single line (remove newlines and extra spaces)
    single_line_text = " ".join(text.split())

    print("Extracted Text:\n", single_line_text)

    # Start typing with delay
    time.sleep(2)  # Wait for 1 second before typing
    type_text_slowly(single_line_text)


def type_text_slowly(text):
    """Types extracted text with a realistic typing effect."""
    for char in text:
        keyboard.write(char, delay=0.01)  # Simulated typing speed (~75 WPM)
        time.sleep(0.01)  # Adds a slight delay between characters


if __name__ == "__main__":
    app = QApplication(sys.argv)
    snipper = SnippingTool()
    app.exec_()  # Wait for user selection

    # Ensure screenshot is taken before processing
    if snipper.selection_done:
        get_text_from_image()
    else:
        print("No selection made. Exiting.")
