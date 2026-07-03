import { test, expect, APIRequestContext } from '@playwright/test';
import { BaseApi } from './BaseApi';
import { BookingApi } from './BookingApi';
import { RoomType, RoomAmenities, getAmenitiesAsList } from '../pages/RoomsPage';
import { getImageUrl } from '../utils/test-data-util';

const path = '/api/room';

export class RoomApi extends BaseApi {
  readonly bookingApi: BookingApi;

  constructor(request: APIRequestContext) {
    super(request);
    this.bookingApi = new BookingApi(request);
  }

  async createRoom(roomName: string, roomType: RoomType, roomIsAccessible: boolean, roomPrice: number, roomAmenities: RoomAmenities) {
    await this.deleteAllRooms(roomName);

    await test.step(`Create ${roomType} Room with name '${roomName}'`, async () => {
      const response = await this.request.post(`${path}/`, {
        data: {
          roomName: roomName,
          type: roomType,
          accessible: roomIsAccessible.toString(),
          roomPrice: roomPrice.toString(),
          features: getAmenitiesAsList(roomAmenities),
          image: getImageUrl(roomType),
          description: `Room ${roomName}; Created with Automated Test`
        }
      });
      expect(response.ok(), `${roomType} Room with name '${roomName}' is created`).toBeTruthy();
    });
  }

  async getRoomIdByName(roomName: string): Promise<number> {
    return await test.step(`Get room id for room with name '${roomName}'`, async () => {
      const allRooms = await this.getAllRooms();
      const room = allRooms.find((currentRoom) => currentRoom.roomName === roomName);
      expect(room, `Room with name '${roomName}' exists`).toBeTruthy();
      return room!.roomid;
    });
  }

  async deleteRoom(roomId: number) {
    await this.bookingApi.deleteAllBookings(roomId);

    await test.step(`Delete room with id: ${roomId}`, async () => {
      const response = await this.request.delete(`${path}/${roomId}`);
      expect([202, 404], `Room with id: ${roomId} is deleted`).toContain(response.status());
    });
  }

  async getAllRooms(checkin?: string, checkout?: string) {
    const response = await this.request.get(`${path}/`, {
      params: {
        ...(checkin && { checkin }),
        ...(checkout && { checkout })
      }
    });
    expect(response.ok(), 'All rooms are fetched').toBeTruthy();
    const { rooms } = await this.getJson<{ rooms: { roomid: number; roomName: string }[] }>(response);
    return rooms;
  }

  async deleteAllRooms(roomName: string) {
    await test.step(`Delete all rooms with name: '${roomName}'`, async () => {
      const allRooms = await this.getAllRooms();
      const filteredRoomsByName = allRooms.filter((room) => room.roomName == roomName);
      for (const room of filteredRoomsByName) await this.deleteRoom(room.roomid);
    });
  }
}
