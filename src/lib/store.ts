let medications: any[] = [];

export function getMeds() {
  return medications;
}

export function addMed(med: any) {
  medications.push(med);
}

export function toggleMed(id: number) {
  medications = medications.map((m) =>
    m.id === id ? { ...m, active: !m.active } : m
  );
}