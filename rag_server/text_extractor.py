

import pytesseract
from pdf2image import convert_from_path
from pathlib import Path

# Path to Tesseract executable (update for your system)
# For Windows:
pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files (x86)/Tesseract-OCR/tesseract.exe'

# Path to Poppler bin directory (update for your system)
poppler_path = r"C:/Program Files/poppler-24.08.0/Library/bin"  # Replace 'xx' with your Poppler version

# Function to extract text from a scanned PDF
def extract_text_from_scanned_pdf(pdf_path):
    """
    Extracts text from a scanned PDF using pdf2image and Tesseract OCR.

    Args:
        pdf_path (str): Path to the scanned PDF file.

    Returns:
        str: Extracted text from the PDF.
    """
    # Convert PDF pages to images
    images = convert_from_path(pdf_path, poppler_path=poppler_path)
    
    all_text = ""
    for page_num, image in enumerate(images):
        print(f"Processing page {page_num + 1}...")
        # Perform OCR on the image
        text = pytesseract.image_to_string(image)
        all_text += f"\n--- Page {page_num + 1} ---\n{text}"
    
    return all_text

# Example usage
if __name__ == "__main__":
    # Specify the path to your scanned PDF
    pdf_file = r"C:/Shreshth/rag_final/rag_server/pdfs/Career_Development_Policy-2019.pdf"  # Replace with your PDF path

    # Extract text
    try:
        extracted_text = extract_text_from_scanned_pdf(pdf_file)
        print("Text extraction completed.")
        
        # Save extracted text to a file
        output_file = Path(pdf_file).stem + "_extracted_text.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(extracted_text)
        
        print(f"Extracted text saved to: {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")
