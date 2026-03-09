import os
import sys
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY missing.")
        return

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = sys.argv[1] if len(sys.argv) > 1 else input("Kodlanacak konu: ")

    system_prompt = (
        "Sen bir uzman web geliştiricisin. Kullanıcının istediği konuyu araştır "
        "ve tam çalışan tek bir HTML dosyası (CSS ve JS içinde) oluştur. "
        "Sadece kodu döndür, açıklama yapma."
    )

    try:
        response = model.generate_content(f"{system_prompt}\n\nİstek: {prompt}")
        code = response.text.replace("```html", "").replace("```", "").strip()

        filename = f"generated_{int(os.path.getmtime('nexus_coder.py'))}.html"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(code)

        print(f"Başarılı! Dosya oluşturuldu: {filename}")
    except Exception as e:
        print(f"Hata: {str(e)}")

if __name__ == "__main__":
    main()
