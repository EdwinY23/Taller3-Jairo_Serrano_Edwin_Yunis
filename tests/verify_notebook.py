#!/usr/bin/env python3
"""Ejecuta las celdas del notebook académico como una prueba integrada."""
import json
import os
from pathlib import Path

root = Path(__file__).resolve().parents[1]
book = root / "book"
notebook = json.loads((book / "verificacion.ipynb").read_text(encoding="utf-8"))
assert notebook["nbformat"] == 4
namespace = {"__name__": "__main__"}
os.chdir(book)
for number, cell in enumerate(notebook["cells"], start=1):
    if cell["cell_type"] != "code":
        continue
    content = "".join(cell["source"])
    print(f"\n=== Ejecución de celda {number} ===", flush=True)
    exec(compile(content, str(book / "verificacion.ipynb") + f":cell_{number}", "exec"), namespace)

print("\nVALIDACIÓN EXITOSA: Spearman, matriz U, ROC, Solver, heurística y cotas óptimas.")
