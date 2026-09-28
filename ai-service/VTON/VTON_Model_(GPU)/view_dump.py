import gzip
import json
import sys

def view_dump(dump_file='aurafit_project_dump.json.gz'):
    """View the project dump contents"""
    with gzip.open(dump_file, 'rt', encoding='utf-8') as f:
        data = json.load(f)
    
    metadata = data['metadata']
    print("=" * 60)
    print(f"📁 AuraFit Project Dump")
    print("=" * 60)
    print(f"📅 Generated: {metadata['scan_date']}")
    print(f"📊 Total Files: {metadata['total_files']}")
    print(f"📝 Total Lines: {metadata['total_lines']:,}")
    print(f"💾 Size: {metadata['size_mb']}")
    print("=" * 60)
    
    print("\n📂 Files:")
    for filepath, info in sorted(data['files'].items()):
        if 'content' in info:
            lines = info.get('lines', 0)
            size = info.get('size', 0)
            print(f"  📄 {filepath} ({lines} lines, {size} bytes)")
        elif 'skipped' in info:
            print(f"  ⚠️  {filepath} - {info['skipped']}")
    
    return data

def extract_file(dump_file='aurafit_project_dump.json.gz', file_pattern=''):
    """Extract specific files from the dump"""
    with gzip.open(dump_file, 'rt', encoding='utf-8') as f:
        data = json.load(f)
    
    matched = []
    for filepath, info in data['files'].items():
        if file_pattern.lower() in filepath.lower() and 'content' in info:
            matched.append((filepath, info))
    
    if not matched:
        print(f"❌ No files found matching: {file_pattern}")
        return
    
    for filepath, info in matched:
        print(f"\n{'='*60}")
        print(f"📄 File: {filepath}")
        print(f"{'='*60}\n")
        print(info['content'])

if __name__ == '__main__':
    if len(sys.argv) > 1:
        extract_file(file_pattern=sys.argv[1])
    else:
        view_dump()
