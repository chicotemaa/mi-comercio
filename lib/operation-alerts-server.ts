import "server-only";
import {
  getBusinessDataBundle,
  getBusinessOperationsBundle,
} from "./business-data";
import { buildOperationAlerts, type OperationAlert } from "./operation-alerts";
import { financeRequest } from "./finance-server";
export async function getOperationAlerts() {
  const [business, operations, finance] = await Promise.all([
    getBusinessDataBundle(),
    getBusinessOperationsBundle(),
    financeRequest("alerts") as Promise<OperationAlert[]>,
  ]);
  const data = buildOperationAlerts({
    appointments: business.appointments,
    payments: operations.payments,
    workRecords: operations.workRecords,
    timeZone: business.business.timeZone,
  });
  data.alerts.push(...finance);
  data.alerts.sort(
    (a, b) =>
      a.priority - b.priority ||
      a.date.localeCompare(b.date) ||
      a.id.localeCompare(b.id),
  );
  for (const alert of finance) data.counts[alert.kind]++;
  data.attentionCount += finance.length;
  return data;
}
