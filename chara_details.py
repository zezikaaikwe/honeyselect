#!/usr/bin/env python
# -*- coding: utf-8 -*-

import struct
import sys

reload(sys)
sys.setdefaultencoding('UTF8')

input_file = sys.argv[1]

f = open(input_file, 'rb+')


def read_bytes_as_hex(position):
        return read_bytes(position).encode('hex')

def read_bytes_as_utf(position):
        byt = read_bytes(position)
        return byt.decode('utf-8')

def read_bytes_as_int(position):
        return int(read_bytes_as_hex(position), 16)

def read_bytes_as_float(position):
        return struct.unpack('<f', read_bytes_as_hex(position).decode('hex'))[0]

def read_bytes(byte_count):
        return f.read(byte_count)


bs = f.read()

iend = bs.find('\x49\x45\x4E\x44')

clothes = bs.find('\x48\x6F\x6E\x65\x79\x53\x65\x6C\x65\x63\x74\x43\x6C\x6F\x74\x68\x65\x73\x46\x65\x6D\x61\x6C\x65')

f.seek(iend + 186 + 615)

namelen = read_bytes_as_int(1)

name = read_bytes_as_utf(namelen)

f.seek(iend + 185)

push_fwd = read_bytes_as_int(1)

f.seek(iend + 185 + 1 + 879 + push_fwd)

i = 0
l = [sys.argv[1], name]
while i < 32:
        v = read_bytes_as_float(4)
        l.append(round(v, 3))
        i += 1

#print 'file,name,height,breast,bheight,bdirect,bspacing,bangle,blength,aerolpuff,nipwid,head,neckwid,neckthik,thorwid,thorthik,cheswid,chesthik,waistwid,waistthik,waistheight,pelviswid,pelvisthik,hipswidth,hipsthik,butt,buttang,thighs,legs,calves,ankles,should,uparm,lowarm,areolasize,bsoft,bweight'


f.seek(clothes - 24)
areola = read_bytes_as_float(4)
bsoft = read_bytes_as_float(4)
bweight = read_bytes_as_float(4)

l.append(round(areola, 3))
l.append(round(bsoft, 3))
l.append(round(bweight, 3))

print ','.join(map(unicode, l))

f.close()
