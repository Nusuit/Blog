// src/api/services/friendService.js
import axiosClient from '../axios';

export const friendService = {
  addFriend: (friendId) => axiosClient.post('/friend/add-friend', { friendId }),
  acceptFriend: (friendId) => axiosClient.post('/friend/accept-friend', { friendId }),
  declineFriend: (friendId) => axiosClient.post('/friend/decline-friend', { friendId }),
  removeFriend: (friendId) => axiosClient.post('/friend/remove-friend', { friendId }),
  getFriendRequests: () => axiosClient.get('/friend/requests'),
  getFriends: () => axiosClient.get('/friend/list'),
};