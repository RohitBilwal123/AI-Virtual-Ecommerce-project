import os
import sys
from datetime import datetime

def scan_directory(directory, exclude_dirs=None, exclude_extensions=None):
    if exclude_dirs is None:
        exclude_dirs = ['.git', '__pycache__', 'venv', '.pytest_cache', '.mypy_cache', 'node_modules', 'temp', 'tmp']
    if exclude_extensions is None:
        exclude_extensions = ['.pyc', '.pyo', '.pyd', '.so', '.dll', '.exe', '.pycache']
    
    result = {
        'folders': [],
        'files': {},
        'total_size': 0,
        'large_folders': {}
    }
    
    total_files = 0
    total_folders = 0
    
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        rel_path = os.path.relpath(root, directory)
        if rel_path != '.':
            result['folders'].append(rel_path)
            total_folders += 1
        
        for file in files:
            if any(file.endswith(ext) for ext in exclude_extensions):
                continue
                
            file_path = os.path.join(rel_path, file) if rel_path != '.' else file
            full_path = os.path.join(root, file)
            try:
                size = os.path.getsize(full_path)
                result['files'][file_path] = size
                result['total_size'] += size
                total_files += 1
            except:
                pass
    
    folder_sizes = {}
    for root, dirs, files in os.walk(directory):
        if any(excl in root for excl in exclude_dirs):
            continue
        for dir_name in dirs:
            if dir_name in exclude_dirs:
                continue
            dir_path = os.path.join(root, dir_name)
            total_size = 0
            for subroot, _, subfiles in os.walk(dir_path):
                for file in subfiles:
                    try:
                        total_size += os.path.getsize(os.path.join(subroot, file))
                    except:
                        pass
            rel_path = os.path.relpath(dir_path, directory)
            if total_size > 1024 * 1024:  # > 1MB
                folder_sizes[rel_path] = total_size
    
    result['large_folders'] = folder_sizes
    result['stats'] = {
        'total_files': total_files,
        'total_folders': total_folders,
        'total_size_mb': result['total_size'] / (1024 * 1024),
        'total_size_gb': result['total_size'] / (1024 * 1024 * 1024)
    }
    
    return result

def generate_report(structure):
    """Generate a formatted report"""
    lines = []
    lines.append("=" * 80)
    lines.append("📁 AURAFIT PROJECT STRUCTURE SCAN")
    lines.append("=" * 80)
    lines.append(f"Scan Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"Scan Location: {os.getcwd()}")
    lines.append("")
    
    stats = structure['stats']
    lines.append("📊 STATISTICS")
    lines.append("-" * 40)
    lines.append(f"Total Files: {stats['total_files']}")
    lines.append(f"Total Folders: {stats['total_folders']}")
    lines.append(f"Total Size: {stats['total_size_mb']:.1f} MB ({stats['total_size_gb']:.2f} GB)")
    lines.append("")
    
    lines.append("📁 FOLDER STRUCTURE")
    lines.append("-" * 40)
    for folder in sorted(structure['folders']):
        depth = folder.count('\\') + 1
        indent = "  " * (depth - 1)
        lines.append(f"{indent}📁 {folder}")
    lines.append("")
    
    lines.append("📄 FILES")
    lines.append("-" * 40)
    
    files_by_ext = {}
    for file_path, size in structure['files'].items():
        ext = os.path.splitext(file_path)[1].lower() or 'no_extension'
        if ext not in files_by_ext:
            files_by_ext[ext] = []
        files_by_ext[ext].append((file_path, size))
    
    for file_path, size in sorted(structure['files'].items()):
        size_mb = size / (1024 * 1024)
        size_kb = size / 1024
        if size_mb > 1:
            size_str = f"{size_mb:.1f} MB"
        elif size_kb > 1:
            size_str = f"{size_kb:.0f} KB"
        else:
            size_str = f"{size} B"
        indent = "  " * (file_path.count('\\'))
        lines.append(f"{indent}📄 {file_path} ({size_str})")
    lines.append("")
    
    lines.append("📦 LARGE FOLDERS (> 10 MB)")
    lines.append("-" * 40)
    large_folders = {k: v for k, v in structure['large_folders'].items() if v > 10 * 1024 * 1024}
    for folder, size in sorted(large_folders.items(), key=lambda x: x[1], reverse=True):
        size_mb = size / (1024 * 1024)
        size_gb = size / (1024 * 1024 * 1024)
        if size_gb > 1:
            size_str = f"{size_gb:.2f} GB"
        else:
            size_str = f"{size_mb:.1f} MB"
        lines.append(f"  📁 {folder}: {size_str}")
    lines.append("")
    
    lines.append("💡 RECOMMENDATIONS FOR SPACE DEPLOYMENT")
    lines.append("-" * 40)
    
    essential_files = ['gradio_demo', 'src', 'preprocess', 'app.py', 'requirements.txt']
    lines.append("Essential files check:")
    for essential in essential_files:
        exists = any(essential in f for f in structure['files'].keys()) or any(essential in f for f in structure['folders'])
        status = "✅" if exists else "❌"
        lines.append(f"  {status} {essential}")
    
    lines.append("")
    large_files = [(f, s) for f, s in structure['files'].items() if s > 100 * 1024 * 1024]
    if large_files:
        lines.append("Large files (> 100 MB):")
        for file_path, size in sorted(large_files, key=lambda x: x[1], reverse=True):
            size_mb = size / (1024 * 1024)
            lines.append(f"  ⚠️ {file_path}: {size_mb:.1f} MB")
    else:
        lines.append("✅ No files > 100 MB found")
    
    lines.append("")
    lines.append("=" * 80)
    lines.append("END OF SCAN")
    lines.append("=" * 80)
    
    return "\n".join(lines)

print("🔍 Scanning project directory...")
print("⏳ Please wait, this may take a few minutes...")

structure = scan_directory(os.getcwd())

report = generate_report(structure)

output_file = 'aurafit_structure.txt'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(report)

print(f"✅ Scan complete!")
print(f"📄 Report saved to: {output_file}")
print(f"📊 Total size: {structure['stats']['total_size_gb']:.2f} GB")
print(f"📂 Total files: {structure['stats']['total_files']}")
print(f"📁 Total folders: {structure['stats']['total_folders']}")

print("\n" + "=" * 50)
print("📋 QUICK SUMMARY:")
print("=" * 50)
print(f"Files to move to Space: {structure['stats']['total_files']}")
print(f"Total space required: {structure['stats']['total_size_gb']:.2f} GB")
print(f"Space limit: 50 GB")

if structure['stats']['total_size_gb'] > 45:
    print("\n⚠️ WARNING: Project size is close to the 50GB limit!")
    print("Consider:")
    print("  - Removing large checkpoint files")
    print("  - Downloading models in the Space instead of uploading them")