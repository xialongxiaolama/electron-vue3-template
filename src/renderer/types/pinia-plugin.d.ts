// import 'pinia'; // 必须导入源声明文件
// import type { StateTree } from 'pinia';

// declare module 'pinia' {
//   export interface DefineStoreOptionsBase<S extends StateTree, Store> {
//     persist?: PersistOptions<S> | PersistOptions<S>[];
//   }

//   interface PersistOptions<S extends StateTree> {
//     key?: string;
//     storage?: Storage;
//     paths?: (keyof S)[];
//     beforeRestore?: (context: PersistContext<S>) => void;
//     afterRestore?: (context: PersistContext<S>) => void;
//     serializer?: {
//       serialize: (value: S) => string;
//       deserialize: (value: string) => S;
//     };
//   }

//   interface PersistContext<S extends StateTree> {
//     store: StoreGeneric;
//     storage: Storage;
//     key: string;
//     state: S;
//   }

//   // 扩展 Store 实例类型（不要覆盖 StoreDefinition）
//   export interface PiniaCustomProperties {
//     // 添加自定义方法/属性
//     $patch: () => void
//   }
// }