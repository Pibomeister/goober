import { Timestamp } from '@firebase/firestore';

export const convertFirebaseTimestampToDate = (timestamp: Timestamp) => {
  return timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
};
