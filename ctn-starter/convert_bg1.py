from pathlib import Path
import colorsys
import numpy as np
from PIL import Image


def hex_to_rgb_norm(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16)/255.0 for i in (0, 2, 4))


def process_image(in_path: Path, target_hex="#6c6389", tint_hex="#fbf6f7"):
    img = Image.open(in_path).convert("RGBA")
    arr = np.array(img).astype(np.float32) / 255.0

    rgb = arr[..., :3]
    alpha = arr[..., 3]

    # Detect non-almost-white pixels (the dots + antialiased edges)
    white_thresh = 240/255.0
    mask = ~((rgb[..., 0] > white_thresh) & (rgb[..., 1] > white_thresh) & (rgb[..., 2] > white_thresh))

    h_t, l_t, s_t = colorsys.rgb_to_hls(*hex_to_rgb_norm(target_hex))

    hls = np.zeros_like(rgb)

    hls_flat = hls.reshape(-1, 3)
    rgb_flat = rgb.reshape(-1, 3)
    mask_flat = mask.reshape(-1)

    # Process only masked pixels to save time
    idxs = np.nonzero(mask_flat)[0]
    for i in idxs:
        r, g, b = rgb_flat[i]
        h, l, s = colorsys.rgb_to_hls(r, g, b)

        # Replace hue with target hue, reduce saturation to get pastel look,
        # but keep the original luminance to preserve watercolor shading.
        new_h = h_t
        new_s = s * 0.55

        nr, ng, nb = colorsys.hls_to_rgb(new_h, l, new_s)
        rgb_flat[i, 0] = nr
        rgb_flat[i, 1] = ng
        rgb_flat[i, 2] = nb

    new_rgb = rgb_flat.reshape(rgb.shape)

    # Compose over two backgrounds: white and tinted
    bg_white = np.ones_like(new_rgb)  # white
    tint_rgb = np.array(hex_to_rgb_norm(tint_hex), dtype=new_rgb.dtype)
    bg_tint = np.ones_like(new_rgb) * tint_rgb.reshape((1, 1, 3))

    # Alpha composite: out = src*alpha + bg*(1-alpha)
    alpha_3 = alpha[..., None]
    out_white = (new_rgb * alpha_3) + (bg_white * (1 - alpha_3))
    out_tint = (new_rgb * alpha_3) + (bg_tint * (1 - alpha_3))

    # Convert back to uint8
    def to_image(arrf):
        arr8 = np.clip((arrf * 255.0).round(), 0, 255).astype(np.uint8)
        return Image.fromarray(arr8)

    img_white = to_image(out_white)
    img_tint = to_image(out_tint)

    stem = in_path.stem
    out_dir = in_path.parent

    out_webp_white = out_dir / f"{stem}_pastel_lilac_white.webp"
    out_webp_tint = out_dir / f"{stem}_pastel_lilac_tinted.webp"
    out_png_white = out_dir / f"{stem}_pastel_lilac_white.png"
    out_png_tint = out_dir / f"{stem}_pastel_lilac_tinted.png"

    # Save PNG and WEBP (WEBP quality can be adjusted)
    img_white.save(out_png_white, "PNG")
    img_tint.save(out_png_tint, "PNG")

    img_white.save(out_webp_white, "WEBP", quality=90)
    img_tint.save(out_webp_tint, "WEBP", quality=90)

    return {
        "png_white": out_png_white,
        "png_tint": out_png_tint,
        "webp_white": out_webp_white,
        "webp_tint": out_webp_tint,
    }


if __name__ == "__main__":
    base = Path(__file__).resolve().parent
    in_path = base / "assets" / "backgrounds" / "BG1.png"
    if not in_path.exists():
        print(f"Input file not found: {in_path}")
        raise SystemExit(1)

    print("Przetwarzam:", in_path)
    outs = process_image(in_path)
    print("Zapisano pliki:")
    for k, v in outs.items():
        print(f" - {k}: {v}")
