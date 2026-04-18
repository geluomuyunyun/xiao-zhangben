import { useState, useMemo } from 'react';
import { useStore, type BillRecord } from '../store/useStore';
import { getCurrentYearMonth } from '../utils/format';
import MonthSummaryCard from '../components/MonthSummaryCard';
import BillList from '../components/BillList';
import RecordModal from '../components/RecordModal';
import FAB from '../components/FAB';

export default function BillsPage() {
  const { records, categories, getRecordsByMonth } = useStore();

  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth);
  const [modalVisible, setModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<BillRecord | null>(null);

  const monthRecords = useMemo(
    () => getRecordsByMonth(yearMonth.year, yearMonth.month),
    [records, yearMonth.year, yearMonth.month],
  );

  const totalExpense = useMemo(
    () => monthRecords.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0),
    [monthRecords],
  );
  const totalIncome = useMemo(
    () => monthRecords.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0),
    [monthRecords],
  );

  const handlePrevMonth = () => {
    setYearMonth((prev) => {
      if (prev.month === 1) return { year: prev.year - 1, month: 12 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setYearMonth((prev) => {
      if (prev.month === 12) return { year: prev.year + 1, month: 1 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const openAdd = () => {
    setEditRecord(null);
    setModalVisible(true);
  };

  const openEdit = (record: BillRecord) => {
    setEditRecord(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditRecord(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <MonthSummaryCard
        year={yearMonth.year}
        month={yearMonth.month}
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <BillList
        records={monthRecords}
        categories={categories}
        onClickRecord={openEdit}
      />

      <FAB onClick={openAdd} />

      <RecordModal
        visible={modalVisible}
        onClose={closeModal}
        editRecord={editRecord}
      />
    </div>
  );
}
