init = 65
width = 8
height = 8

# for i in range(1):
#     for j in range(12):
#         print(f'<char id="{init + (i * 12) + j}" x="{width * j}" y="{56}" width="{width}" height="{height}" xoffset="0" yoffset="0" xadvance="{width}" page="0" chnl="15" />')

# for i in range(3):
#     for j in range(8):
#         print(f'<char id="{init + (i * 8) + j}" x="{width * j}" y="{31 + height * i}" width="{width}" height="{height}" xoffset="0" yoffset="0" xadvance="{width}" page="0" chnl="15" />')
    
for i in range(25):
    print(f'<char id="{97 + i}"')