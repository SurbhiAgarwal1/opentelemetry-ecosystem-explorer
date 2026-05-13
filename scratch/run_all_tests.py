import os
import subprocess
import sys

packages = [
    "collector-watcher",
    "configuration-watcher",
    "java-instrumentation-watcher",
    "explorer-db-builder",
    "watcher-common",
]

base_dir = "ecosystem-automation"
root_dir = os.getcwd()

python_path = []
for pkg in packages:
    python_path.append(os.path.join(root_dir, base_dir, pkg, "src"))

env = os.environ.copy()
env["PYTHONPATH"] = ";".join(python_path)

all_passed = True

for pkg in packages:
    print(f"--- Running tests for {pkg} ---")
    test_path = os.path.join(base_dir, pkg, "tests")
    if not os.path.exists(test_path):
        print(f"Skipping {pkg}, no tests found at {test_path}")
        continue
    
    result = subprocess.run(
        [sys.executable, "-m", "pytest", test_path],
        env=env,
        cwd=root_dir
    )
    if result.returncode != 0:
        all_passed = False
        print(f"[FAIL] {pkg} tests failed")
    else:
        print(f"[PASS] {pkg} tests passed")

if all_passed:
    print("\nAll automation tests passed!")
    sys.exit(0)
else:
    print("\nSome automation tests failed.")
    sys.exit(1)
