// TYPE GUARDS

export const typeGuardStorageStructure = (
  structure: AnyStructure | AnyOwnedStructure
): structure is AnyStoreStructure => 'store' in structure;
