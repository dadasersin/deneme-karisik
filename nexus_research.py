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

    # Configure model with system instruction and tools
    model = genai.GenerativeModel(
        model_name='gemini-3-flash-preview',
        system_instruction="Sen Nexus AI, profesyonel bir araştırmacı ve geliştiricisin. Kullanıcı ne sorarsa sorsun, internet üzerinde derinlemesine araştırma yaparak en doğru ve güncel bilgileri bulmalı ve yanıtlamalısın. Yanıtların her zaman doğru, detaylı ve güvenilir kaynaklara dayalı olmalıdır. Yanıtlarında mutlaka ilgili kaynak linklerini (referansları) paylaşmalısın.",
        tools=[{ "google_search_retrieval": {} }]
    )

    print("--- Nexus AI Python Research Interface ---")

    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = input("Research Query: ")

    if not query:
        print("No query provided.")
        return

    print(f"\nSearching for: {query}...")
    print("Analyzing neural data with Google Search grounding...")

    try:
        response = model.generate_content(query)
        print("\n--- Research Results ---")
        print(response.text)

        # In Python SDK, search results are often in response.candidates[0].grounding_metadata
        if hasattr(response, 'candidates') and len(response.candidates) > 0:
            metadata = response.candidates[0].grounding_metadata
            if metadata and metadata.search_entry_point:
                print("\nSources & References:")
                print(metadata.search_entry_point.rendered_content)
    except Exception as e:
        print(f"\nSystem Error: {str(e)}")

if __name__ == "__main__":
    main()
