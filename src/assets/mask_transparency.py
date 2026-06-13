import os
import math
from PIL import Image

image_path = "/Users/israahhanfa/.gemini/antigravity-ide/brain/70797b1c-ed5e-4f8a-beeb-0b6dcc4e3abd/media__1781361918447.jpg"
img = Image.open(image_path).convert("RGBA")
width, height = img.size

panels = {
    # (x1, y1, x2, y2, cx, cy, mask_r)
    "idle": (0, 0, 256, 443, 128, 255, 140),
    "listening": (256, 0, 512, 443, 384, 255, 140),
    "thinking": (512, 0, 768, 443, 640, 250, 140),
    "talking": (768, 0, 1024, 443, 896, 255, 145),
    "happy": (0, 443, 410, 886, 205, 680, 180),
    "error": (410, 443, 695, 886, 552, 715, 175)
}

assets_dir = "/Users/israahhanfa/AI_Companion/nova/src/assets"
os.makedirs(assets_dir, exist_ok=True)

def process_panel(name, x1, y1, x2, y2, cx, cy, mask_r):
    panel = img.crop((x1, y1, x2, y2))
    p_width, p_height = panel.size
    
    rcx = cx - x1
    rcy = cy - y1
    
    corners = [panel.getpixel((0, 0)), panel.getpixel((p_width-1, 0)), 
               panel.getpixel((0, p_height-1)), panel.getpixel((p_width-1, p_height-1))]
    avg_bg = tuple(sum(c[i] for c in corners) // len(corners) for i in range(3))
    
    threshold = 30
    soft = 16
    
    new_data = []
    for y in range(p_height):
        for x in range(p_width):
            r, g, b, a = panel.getpixel((x, y))
            
            dist = math.sqrt((r - avg_bg[0])**2 + (g - avg_bg[1])**2 + (b - avg_bg[2])**2)
            dx = x - rcx
            dy = y - rcy
            dist_to_center = math.sqrt(dx*dx + dy*dy)
            
            if dist < threshold:
                color_alpha = 0
            elif dist < threshold + soft:
                color_alpha = int(255 * (dist - threshold) / soft)
            else:
                color_alpha = 255
                
            inner_r = mask_r * 0.82
            outer_r = mask_r
            if dist_to_center > outer_r:
                circle_alpha = 0
            elif dist_to_center > inner_r:
                circle_alpha = int(255 * (1 - (dist_to_center - inner_r) / (outer_r - inner_r)))
            else:
                circle_alpha = 255
                
            final_alpha = min(color_alpha, circle_alpha)
            final_alpha = min(final_alpha, a)
            
            brightness = (r + g + b) / 3
            if brightness > 75:
                final_alpha = max(final_alpha, min(255, int(brightness * 1.5)))
            
            # Advanced Staircase Crop Masks:
            if name == "idle":
                if y < 120:
                    final_alpha = 0
                elif x > 220 and y < 260:
                    final_alpha = 0
            elif name == "listening":
                if y < 120:
                    final_alpha = 0
            elif name == "thinking":
                if y < 115:
                    final_alpha = 0
            elif name == "talking":
                if y < 115:
                    final_alpha = 0
            elif name == "happy":
                # Precise mask to remove text on left while keeping full halo width
                if y < 62 and x < 130:
                    final_alpha = 0
                elif y < 82 and x < 140:
                    final_alpha = 0
                elif y < 98 and x < 145:
                    final_alpha = 0
                elif y < 140 and x < 165:
                    final_alpha = 0
                # Clear footer text at bottom
                if y > 385:
                    final_alpha = 0
                # Clear control panel border at bottom right
                if x > 380 and y > 400:
                    final_alpha = 0
            elif name == "error":
                # Clear top-center text remnant and title text
                if y < 115:
                    final_alpha = 0
                elif x < 120 and y < 130:
                    final_alpha = 0
                # Clear footer text at bottom
                if y > 385:
                    final_alpha = 0
                    
            new_data.append((r, g, b, final_alpha))
            
    panel.putdata(new_data)
    
    bbox = panel.getbbox()
    if bbox:
        padded_bbox = (
            max(0, bbox[0] - 4),
            max(0, bbox[1] - 4),
            min(p_width, bbox[2] + 4),
            min(p_height, bbox[3] + 4)
        )
        cropped_panel = panel.crop(padded_bbox)
    else:
        cropped_panel = panel
        
    out_path = os.path.join(assets_dir, f"{name}.png")
    cropped_panel.save(out_path, "PNG")
    print(f"Saved {name}.png, bbox: {bbox}, size: {cropped_panel.size}")

for name, params in panels.items():
    process_panel(name, *params)
