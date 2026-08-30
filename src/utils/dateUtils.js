// Utilitários de Cálculo Retroativo de Datas (Regra: Save the Date 6m / Convite 3m / Festa)

/**
 * Calcula o prazo do Save the Date (6 meses antes da Festa)
 */
export function calculateSaveTheDateDeadline(partyDateStr) {
  if (!partyDateStr) return '';
  const date = new Date(partyDateStr + 'T00:00:00');
  date.setMonth(date.getMonth() - 6);
  return date.toISOString().split('T')[0];
}

/**
 * Calcula o prazo do Convite (3 meses antes da Festa)
 */
export function calculateInvitationDeadline(partyDateStr) {
  if (!partyDateStr) return '';
  const date = new Date(partyDateStr + 'T00:00:00');
  date.setMonth(date.getMonth() - 3);
  return date.toISOString().split('T')[0];
}

/**
 * Formata data no padrão brasileiro (DD/MM/AAAA)
 */
export function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Verifica se uma data está próxima ou vencida em relação ao dia atual
 */
export function getDaysDiffFromToday(targetDateStr) {
  const today = new Date('2026-09-01T00:00:00'); // Referência do sistema
  const target = new Date(targetDateStr + 'T00:00:00');
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
