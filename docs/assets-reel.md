# Video de portada

La portada usa `public/reel/gb-films-fondo-v06.mp4`, derivado del archivo
seleccionado por el usuario, `gbf_reel-2026_v06.mp4`. Se conserva el reel completo
(102,44 segundos), sin audio, a 960 × 540 y 25 fps.

Exportación: FFmpeg, H.264/libx264, preset `medium`, CRF 30, `yuv420p`,
`-an`, `-map_metadata -1` y `-movflags +faststart`. La copia pública pesa
6.909.546 bytes; el máster de 208 MB permanece fuera del repositorio.

`gb-films-fondo-v06.webp` es un fotograma del segundo 5, a 1280 × 720,
exportado con libwebp y calidad 82. Los nombres incluyen la versión para que
las visitas que tienen el reel anterior en caché descarguen el nuevo.

El fondo conserva loop, reproducción silenciada y en línea, pausa al salir de
pantalla y respeto por la preferencia de movimiento reducido. El video de
YouTube en «¿Qué carajo?» y su imagen `gb-films-fondo.webp` se mantienen.
