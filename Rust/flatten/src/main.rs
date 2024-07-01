use std::fs;
use std::io::Write;
use std::path::Path;
use regex::Regex;

fn main() -> std::io::Result<()> {
    let dir = Path::new("./src");
    let mut output = fs::File::create("./src/main.ts")?;
    let import_regex = Regex::new(r"^import").unwrap();

    visit_dirs(&dir, &mut output, &import_regex)?;

    Ok(())
}

fn visit_dirs(
    dir: &Path,
    output: &mut fs::File,
    import_regex: &Regex,
) -> std::io::Result<()> {
    let skip_files = vec!["main.ts", "types.ts"];
    
    if !dir.is_dir() {
        return Ok(())
    }

    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();

        if path.is_dir() {
            visit_dirs(&path, output, import_regex)?;
        } else {
            if let Some(file_name) = path.file_name().and_then(|name| name.to_str()) {
                
                if skip_files.contains(&file_name) {
                    continue;
                }

                let contents = fs::read_to_string(&path)?;
                let lines: Vec<&str> = contents.lines().collect();

                for line in lines {
                    if !import_regex.is_match(line) {
                        writeln!(output, "{}", line)?;
                    }
                }
            }
        }
    }

    Ok(())
}

