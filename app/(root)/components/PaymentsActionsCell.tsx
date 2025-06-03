"use client";

import { PaymentsColumn } from "./columns";
import { PaymentsCellAction } from "./PaymentsCellAction";

interface PaymentsActionsCellProps {
  data: PaymentsColumn;
}

export const PaymentsActionsCell: React.FC<PaymentsActionsCellProps> = ({
  data,
}) => {
  return <PaymentsCellAction data={data} />;
};
