# Importación desde Excel

El archivo operativo actual del negocio es `planilla_barberia.xlsx`. Para no cargar todo a mano, este repo ahora incluye un importador reproducible en [`scripts/import_barber_excel.py`](/Users/matidev/Documents/Proyects/mi-comercio-app/scripts/import_barber_excel.py).

## Qué importa

- `EMPLEADOS` -> actualiza o crea `staff_members`
- `BASE_DATOS` -> crea servicios faltantes, citas históricas, cobros, gastos y distribuciones
- `HORAS` -> crea `staff_time_logs` si el código del empleado existe

## Criterio actual

- Cada fila de `BASE_DATOS` con `Servicio` genera una cita histórica `manual/completed`.
- Cada fila con `MontoServicio > 0` genera un `payment`.
- Cada fila con `Gasto > 0` genera un `expense`.
- Cada fila con `Distribuidor > 0` genera un `payout`.
- Si el nombre parece cliente, se crea o reutiliza un `customer`.
- Si el nombre no parece cliente, el movimiento igual entra, pero sin asociar cliente.
- Las filas ambiguas quedan en un reporte JSON para revisión manual.

## Uso

1. Crea un entorno virtual para Python:

```bash
python3 -m venv .codex-import-venv
.codex-import-venv/bin/pip install openpyxl
```

2. Corre una simulación:

```bash
.codex-import-venv/bin/python scripts/import_barber_excel.py --dry-run
```

3. Revisa el archivo `.codex-import-review.json`.

4. Si el resumen está bien, aplica la importación:

```bash
.codex-import-venv/bin/python scripts/import_barber_excel.py --apply
```

## Idempotencia

El script marca cada fila importada con referencias del tipo:

- `payments.transaction_id = excel:BASE_DATOS:<fila>`
- `expenses.source = excel:BASE_DATOS:<fila>`
- `payouts.source = excel:BASE_DATOS:<fila>`
- `appointments.internal_notes = excel:BASE_DATOS:<fila>`
- `staff_time_logs.source = excel:HORAS:<fila>`

Eso permite volver a correrlo sin duplicar los registros ya cargados.
