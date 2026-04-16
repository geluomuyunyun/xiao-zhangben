import { useStore } from '../store/useStore';

export default function BillsPage() {
  // TODO: 阶段三删除，临时触发 store 初始化以便验证 LocalStorage
  useStore();

  return (
    <div className="flex-1 flex items-center justify-center">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>账单</h1>
    </div>
  );
}
