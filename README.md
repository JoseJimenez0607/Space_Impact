# Space Impact 60

Remake del *Space Impact* de Nokia en **un solo archivo HTML**, a **60 fps** y a **84×48**,
que es la resolución real de la pantalla del Nokia 3310. Sin dependencias ni build.

Los sprites —la nave, el corazón, los iconos de arma, la fuente de dígitos y **los 6 jefes**—
están extraídos píxel a píxel del juego original y se dibujan a 1:1, sin escalar ni suavizar.

## Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | El juego entero. Es lo único que necesitas para jugar. |
| `apps-script.gs` | Opcional: el código del marcador online para Google Sheets. |

## Jugar

Abre `index.html` en cualquier navegador. Nada más.

| Acción | Teclado | Móvil |
|---|---|---|
| Mover | `←↑↓→` o `WASD` | arrastra el dedo |
| Disparar | `Espacio` / `Z` / `J` | automático al tocar |
| Pausa | `P` o `Esc` | — |
| Sonido | `M` | — |
| Cambiar color de LCD | `C` | — |
| Estela del LCD | `G` | — |
| Contador de fps | `F` | — |
| Pantalla completa | doble clic en la pantalla | — |

## Armas y power-ups

Como en el original, el HUD muestra **el icono del arma que llevas y su nivel** (`01`–`03`),
entre los corazones y la puntuación.

| Icono | Arma | Qué hace |
|---|---|---|
| ◯ | **Cañón** | Disparo recto. Nivel 2 y 3 añaden cañones en paralelo. |
| ⌐ | **Láser** | Más rápido y de mayor alcance, cadencia alta. |
| ✚ | **Dispersor** | Abanico de 2, 3 o 5 proyectiles. |

Los enemigos y los jefes sueltan iconos de arma flotando. Si recoges **uno distinto** cambias
de arma y empiezas a nivel 1; si recoges **el mismo**, sube de nivel (máximo 3). Al perder una
vida bajas un nivel, y desde el nivel 1 vuelves al cañón básico.

## Los jefes

Aparece uno **cada 5 oleadas** y van rotando en este orden. Al completar la vuelta vuelven
a empezar con más vida.

| # | Jefe | Vida | Cómo pelea |
|---|---|---|---|
| 1 | **Espiral** | 100 | Orbita despacio y suelta un reguero de balas en espiral. |
| 2 | **Cráneo** | 135 | Embiste de lado a lado y escupe en abanico. |
| 3 | **Grúa** | 170 | Cuelga de arriba y deja caer bombas que estallan en el suelo. |
| 4 | **Manta** | 205 | Nada en vertical y lanza proyectiles teledirigidos. |
| 5 | **Gancho** | 240 | Estocadas rápidas y suelta cazas. |
| 6 | **Dragón** | 325 | Jefe final: abanicos, rayo cargado y crías. |

Por debajo del **62 % de vida** todos se enfadan: disparan casi al doble de ritmo y cambian de
patrón. El Espiral pasa de un brazo a tres, el Cráneo de abanico de 3 a uno de 5, la Grúa suelta
bombas dobles, la Manta añade un tercer teledirigido y el Dragón pasa de 6 a 9 proyectiles por
ráfaga.

## Marcador online con Google Sheets

Al acabar la partida el juego pide **tres letras**, como las recreativas, y guarda nombre +
puntuación. En la pantalla de título la tabla de récords aparece sola, alternando con el título.

**Sin configurar nada funciona igual**, pero guardando los récords solo en ese navegador
(verás la etiqueta `LOCAL`). Para tener una tabla compartida de verdad:

1. Crea una hoja de cálculo nueva en <https://sheets.google.com>
2. Menú **Extensiones → Apps Script**
3. Borra lo que haya y pega el contenido de `apps-script.gs`. Guarda.
4. **Implementar → Nueva implementación**
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Copia la URL que termina en `/exec`
6. Ábrela una vez en el navegador y acepta los permisos que pida Google
7. En `index.html` busca esta línea y pega la URL entre las comillas:

```javascript
var SCORE_URL = '';
```

Listo: la etiqueta pasará a `ONLINE` y las puntuaciones de todo el mundo irán a tu hoja.
La pestaña `Scores` se crea sola con las columnas nombre, puntos, oleada y fecha.

> Si cambias el código del Apps Script después, acuérdate de hacer **Implementar → Gestionar
> implementaciones → editar → Versión: Nueva**, o seguirá sirviendo la versión vieja.

## Publicarlo en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `space-impact`), público.
2. Sube `index.html` a la **raíz** del repositorio. Puedes arrastrarlo en *Add file → Upload files*, o por consola:

```bash
git init && git add . && git commit -m "Space Impact 60" && git branch -M main && git remote add origin https://github.com/TU-USUARIO/space-impact.git && git push -u origin main
```

3. En el repositorio: **Settings → Pages**.
4. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y pulsa **Save**.
5. Al minuto estará en `https://TU-USUARIO.github.io/space-impact/`

> El archivo debe llamarse `index.html` y estar en la raíz para que la URL funcione sin añadir nada detrás.

## Dificultad

Los enemigos escalan con la oleada: más rápidos, con más vida y disparando más a menudo. A partir
de la **oleada 8** los artilleros disparan ráfagas dobles, y el número de formaciones por oleada
crece hasta 7. El hueco entre oleadas es corto, así que no hay mucho respiro.

Al perder una vida bajas un nivel de arma, la invulnerabilidad es breve y solo se limpian los
enemigos muy pegados a ti, no media pantalla.

## Qué hay dentro

- **84×48 reales**, dibujados en un búfer de 1 bit y volcados a un `<canvas>` con `putImageData`.
  La pantalla se amplía con escalado entero y `image-rendering: pixelated`, así que cada píxel
  del juego es un cuadrado perfecto por grande que pongas la ventana.
- **Bucle de paso fijo**: la lógica corre siempre a 60 Hz con un acumulador y el dibujado va por
  `requestAnimationFrame`. Si el navegador se atasca, el juego no se acelera ni se ralentiza.
- **Estela del LCD**: los píxeles apagados se desvanecen en vez de cortarse de golpe, como en las
  pantallas de la época (se quita con `G`).
- **5 paletas**: menta, verde, ámbar, azul y monocromo.
- **Audio** generado con WebAudio (ondas cuadradas y ruido); no hay ningún archivo de sonido.
- Las estrellas del fondo van todas despacio y a ritmos parecidos, para que nunca se confundan
  con un disparo enemigo.

## Licencia

El código es tuyo, úsalo como quieras. *Space Impact* y *Nokia* son marcas de sus respectivos
dueños; esto es un homenaje hecho por diversión, no un producto oficial.
