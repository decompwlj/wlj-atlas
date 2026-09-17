"""Render an exact-data atlas social card using the generated graph previews."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parent.parent/'dist'
im=Image.new('RGB',(1200,630),'#080e19');draw=ImageDraw.Draw(im)
def font(s):return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
draw.text((48,55),'WLJ / SEQUENCE ATLAS',font=font(20),fill='#62d9ed')
draw.text((48,135),'100 sequences.',font=font(43),fill='#e5ebf6')
draw.text((48,198),'A shared lens.',font=font(43),fill='#e5ebf6')
draw.text((48,310),'weight × level + jump',font=font(24),fill='#aabdd8')
draw.text((48,389),'20 million computed points',font=font(20),fill='#e5ebf6')
draw.text((48,428),'Interactive 2D & 3D graphs',font=font(18),fill='#aabdd8')
draw.text((48,555),'Rémi Eismann / decompwlj',font=font(17),fill='#9eacc3')
for i,(sid,label) in enumerate([('a000069','Odious numbers'),('a014190','Ternary palindromes'),('a019506','Hoax numbers'),('a022839','Beatty: √5')]):
    x=545+(i%2)*320;y=40+(i//2)*285
    preview=Image.open(root/'assets/previews'/f'{sid}.png').resize((320,200),Image.Resampling.LANCZOS)
    im.paste(preview,(x,y+35));draw.text((x+15,y),label,font=font(16),fill='#e5ebf6')
draw.text((566,602),'ln k × ln L · first 25,000 plotted terms per sequence',font=font(13),fill='#9eacc3')
im.save(root/'assets/social-card-atlas.png',optimize=True)
