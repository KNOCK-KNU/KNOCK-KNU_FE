// src/types/store.ts

export type DoorType =
  | '쪽문'
  | '북문'
  | '솔로문'
  | '정문'
  | '서문'
  | '동문'
  | '교내';

export type StoreModifier =
  | '조용한'
  | '사람이 많은'
  | '가성비인'
  | '복층'
  | '넓은'
  | '뷔페식'
  | '복층인'
  | '24시간 하는'
  | '양이 많은';

export type StoreCategory = '음식점' | '헬스장' | '카페' | '술집' | '클라이밍';

export type Store = {
  storeId: number;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  door: DoorType;
  modifier: StoreModifier;
  category: StoreCategory;
};
