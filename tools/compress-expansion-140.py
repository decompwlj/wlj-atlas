"""Recompress only the 20 new datasets with libdeflate level 12.

All uncompressed CSV bytes, content hashes, names and rows stay identical.
Requires the system libdeflate shared library; uses its gzip-compatible C API.
"""
import ctypes
import ctypes.util
import gzip
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
lib = ctypes.CDLL(ctypes.util.find_library('deflate'))
lib.libdeflate_alloc_compressor.argtypes = [ctypes.c_int]
lib.libdeflate_alloc_compressor.restype = ctypes.c_void_p
lib.libdeflate_gzip_compress.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_size_t, ctypes.c_void_p, ctypes.c_size_t]
lib.libdeflate_gzip_compress.restype = ctypes.c_size_t
lib.libdeflate_free_compressor.argtypes = [ctypes.c_void_p]
compressor = lib.libdeflate_alloc_compressor(12)
assert compressor, 'Could not initialize libdeflate'
entries = json.loads((root/'tools/sequences.json').read_text())[120:]
assert len(entries) == 20
before = after = chunks = 0
try:
    for entry in entries:
        directory = root/'dist/data'/entry['id']
        path = directory/'manifest.json'
        manifest = json.loads(path.read_text())
        for chunk in manifest['chunks']:
            file = directory/chunk['file']
            original = file.read_bytes()
            raw = gzip.decompress(original)
            assert hashlib.sha256(raw).hexdigest() == chunk['sha256']
            assert len(raw) == chunk['bytes']
            buffer = ctypes.create_string_buffer(len(raw)+1024)
            size = lib.libdeflate_gzip_compress(compressor, raw, len(raw), buffer, len(buffer))
            assert size > 0
            compressed = buffer.raw[:size]
            assert gzip.decompress(compressed) == raw
            if len(compressed) >= len(original):
                compressed = original
            before += len(original)
            after += len(compressed)
            chunks += 1
            if compressed != original:
                temporary = file.with_suffix('.tmp')
                temporary.write_bytes(compressed)
                temporary.replace(file)
            chunk['compressedBytes'] = len(compressed)
        path.write_text(json.dumps(manifest,separators=(',',':'),ensure_ascii=False))
finally:
    lib.libdeflate_free_compressor(compressor)
assert chunks == 160
size = sum(p.stat().st_size for p in (root/'dist').rglob('*') if p.is_file())
assert size < 256*1024*1024
report = dict(chunksVerified=chunks, originalCompressedBytes=before,
              optimizedCompressedBytes=after, bytesSaved=before-after,
              allUncompressedBytesIdentical=True, staticBytes=size,
              expandedArchiveLimit=256*1024*1024)
(root/'COMPRESSION-140-VALIDATION.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
