import os

def extract_metadata(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()
    
    metadata = []
    for line in lines:
        if line.strip().startswith("// ==UserScript=="):
            metadata.append(line)
            continue
        if metadata and line.strip().startswith("//"):
            metadata.append(line)
        elif metadata:
            break

    return metadata

def process_files():
    for file in os.listdir():
        if file.endswith(".user.js"):
            meta_file = file.replace(".user.js", ".meta.js")
            metadata = extract_metadata(file)
            if metadata:
                with open(meta_file, "w+", encoding="utf-8") as meta_output:
                    meta_output.writelines(metadata)
                print(f"✅ Extracted metadata to: {meta_file}")
            else:
                print(f"⚠️ No metadata found in {file}")

if __name__ == "__main__":
    process_files()
