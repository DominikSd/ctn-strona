# Starter strony (podobnej do screena)

To jest prosty, statyczny szablon (HTML + CSS + JS), który odtwarza układ:
- pasek nawigacji + CTA
- sekcja hero (zdjęcie + opis)
- 5 kafelków usług
- 4 kafelki „Jak mogę pomóc?”
- opinie + kontakt

## Jak uruchomić
1. Otwórz `index.html` w przeglądarce (dwuklik).
2. Albo uruchom lokalny serwer (polecane):
   - VS Code → rozszerzenie „Live Server”
   - lub w terminalu: `python -m http.server 8000`

## Gdzie podmienić obrazki
- `assets/images/hero.webp` → zdjęcie główne (portret)
- `assets/images/pomoc-1.webp` … `pomoc-4.webp` → zdjęcia w kafelkach
- Ikony usług: `assets/icons/*.svg`

## Optymalizacja obrazów
Najlepiej używaj `.webp` (mniejszy rozmiar). Konwerter: Squoosh (Google).
