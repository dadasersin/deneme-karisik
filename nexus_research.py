import os
import sys
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in environment variables.")
        sys.exit(1)

    # Configure Gemini
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    print("--- Nexus AI Python Research Interface ---")

    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = input("Research Query: ")

    if not query:
        print("No query provided.")
        return

    print(f"\nSearching for: {query}...")
    print("Analyzing neural data...")

    try:
        response = model.generate_content(query)
        print("\n--- Research Results ---")
        print(response.text)
        print("\nReferences:")
        print(f"🔗 https://google.com/search?q={query.replace(' ', '+')}")
    except Exception as e:
        print(f"\nSystem Error: {str(e)}")

if __name__ == "__main__":
    main()
