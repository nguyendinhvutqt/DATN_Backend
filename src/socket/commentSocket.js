const lessonRooms = {}; // Đối tượng lưu trữ thông tin các phòng bài học

const handleCommentSocket = (io) => {
  io.on("connection", (socket) => {
    // Sự kiện khi người dùng tham gia phòng bình luận của một bài học
    socket.on("join-room", (room) => {
      socket.join(room); // Tham gia phòng có tên là room

      // Lưu lại thông tin phòng cho người dùng này (có thể lưu vào một đối tượng, ví dụ: lessonRooms)
      if (!lessonRooms[room]) {
        lessonRooms[room] = [socket.id];
      } else {
        lessonRooms[room].push(socket.id);
      }
    });

    // Sự kiện khi người dùng rời khỏi phòng cũ
    socket.on("leave-room", (room) => {
      socket.leave(room); // Rời khỏi phòng cũ

      // Xóa thông tin kết nối người dùng khỏi phòng
      if (lessonRooms[room]) {
        lessonRooms[room] = lessonRooms[room].filter((id) => id !== socket.id);

        // Nếu không còn kết nối nào trong phòng, bạn có thể xóa phòng này
        if (lessonRooms[room].length === 0) {
          delete lessonRooms[room];
        }
      }
    });

    // Sự kiện khi người dùng gửi bình luận trong một phòng
    socket.on("comment", (data) => {
      const { room, comments } = data;

      // Lưu bình luận vào cơ sở dữ liệu ở đây (sử dụng Mongoose hoặc thư viện khác)

      // Sau khi lưu thành công, gửi bình luận mới đến tất cả các kết nối trong phòng bài học
      io.to(room).emit("new-comment", comments);
    });

    // Xử lý sự kiện ngắt kết nối
    socket.on("disconnect", () => {
      // Xóa thông tin kết nối người dùng khi họ ngắt kết nối
      for (const room in lessonRooms) {
        if (lessonRooms[room].includes(socket.id)) {
          lessonRooms[room] = lessonRooms[room].filter(
            (id) => id !== socket.id
          );

          // Nếu không còn kết nối nào trong phòng, bạn có thể xóa phòng này
          if (lessonRooms[room].length === 0) {
            delete lessonRooms[room];
          }
        }
      }
    });
  });
};

module.exports = handleCommentSocket;
