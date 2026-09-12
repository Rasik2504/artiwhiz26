import subprocess

cwd = r'C:\Users\Rasik Rahman\.gemini\antigravity-ide\scratch\artiwhiz26'

def run(cmd):
    res = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, shell=True)
    print(">>>", cmd)
    print("STDOUT:", res.stdout.strip())
    if res.stderr:
        print("STDERR:", res.stderr.strip())
    return res.returncode

run("git init")
run('git config user.name "Rasik Rahman"')
run('git config user.email "rasik@example.com"')
run("git add .")
run('git commit -m "Initial commit for ArtiWhiz 2026 website"')
run("git branch -M main")
run("git remote remove origin")
run("git remote add origin https://github.com/Rasik2504/artiwhiz26.git")
ret = run("git push -u origin main")

if ret == 0:
    print("\nSuccessfully pushed to GitHub!")
else:
    print("\nPush failed or requires credentials/force push. Checking details above...")
