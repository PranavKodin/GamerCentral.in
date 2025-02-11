import cv2
import numpy as np
import time
import threading
import easyocr
from PIL import ImageGrab
import tkinter as tk

# Initialize EasyOCR Reader (Supports English & Hindi, change if needed)
reader = easyocr.Reader(["en"])

class OCRApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Movable OCR Frame")

        # Define window size & position
        self.width, self.height = 300, 150
        self.x, self.y = 100, 100

        # Create a transparent overlay
        self.canvas = tk.Canvas(root, width=self.width, height=self.height, bg="red", highlightthickness=2)
        self.canvas.place(x=self.x, y=self.y)

        # Enable dragging
        self.canvas.bind("<ButtonPress-1>", self.start_move)
        self.canvas.bind("<B1-Motion>", self.do_move)

        # Start OCR Thread
        self.ocr_running = True
        self.ocr_thread = threading.Thread(target=self.run_ocr)
        self.ocr_thread.start()

    def start_move(self, event):
        """Records the starting position for movement."""
        self.start_x = event.x
        self.start_y = event.y

    def do_move(self, event):
        """Moves the canvas frame on screen."""
        self.x += event.x - self.start_x
        self.y += event.y - self.start_y
        self.canvas.place(x=self.x, y=self.y)

    def run_ocr(self):
        """Continuously extracts text from the selected screen area."""
        while self.ocr_running:
            time.sleep(1)  # OCR every second
            image = self.capture_screen()
            text = self.extract_text_easyocr(image)
            if text:
                print("\n📜 Extracted Text:\n", text)

    def capture_screen(self):
        """Captures the screen within the defined rectangle."""
        x1, y1 = self.x, self.y
        x2, y2 = x1 + self.width, y1 + self.height
        image = ImageGrab.grab(bbox=(x1, y1, x2, y2))
        return np.array(image)

    def extract_text_easyocr(self, image):
        """Extracts text from the image using EasyOCR."""
        results = reader.readtext(image)
        return "\n".join([res[1] for res in results]) if results else "No text detected."

    def close_app(self):
        """Stops OCR and closes the app."""
        self.ocr_running = False
        self.root.destroy()

# --- Run the Application ---
root = tk.Tk()
root.geometry("400x300+50+50")  # Starting position
app = OCRApp(root)

# Close on window exit
root.protocol("WM_DELETE_WINDOW", app.close_app)
root.mainloop()
