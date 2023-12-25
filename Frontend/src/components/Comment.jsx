import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

export const Comment = ({ comments, onAddComment }) => {
  const [displayedComments, setDisplayedComments] = useState(
    comments.slice(0, 2)
  );
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const newCommentObject = {
        username: "Nama Pengguna",
        userImageUrl: "https://via.placeholder.com/50",
        text: newComment.trim(),
        time: new Date(),
      };

      let updatedComments = [...displayedComments];
      if (updatedComments.length >= 2) {
        updatedComments.shift();
      }
      updatedComments.push(newCommentObject);

      onAddComment(newCommentObject);
      setDisplayedComments(updatedComments);
      setNewComment("");
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const secondsAgo = Math.round((now - new Date(date)) / 1000);
    const minutesAgo = Math.round(secondsAgo / 60);
    const hoursAgo = Math.round(minutesAgo / 60);
    const daysAgo = Math.round(hoursAgo / 24);

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    } else if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} hours ago`;
    } else {
      return `${daysAgo} days ago`;
    }
  };

  return (
    <View>
      {comments.length > 2 && (
        <TouchableOpacity
          onPress={() => {
            /* Logika untuk melihat semua komentar */
          }}
        >
          <Text style={styles.viewAllCommentsText}>
            View all {comments.length} comments
          </Text>
        </TouchableOpacity>
      )}
      {displayedComments.map((comment, index) => (
        <View key={index} style={styles.commentContainer}>
          <Image
            source={{ uri: comment.userImageUrl }}
            style={styles.userIcon}
          />
          <View style={styles.commentTextContainer}>
            <Text style={styles.username}>{comment.username}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>
            <Text style={styles.commentTime}>{timeAgo(comment.time)}</Text>
          </View>
        </View>
      ))}

      <View style={styles.addCommentContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.userIcon}
        />
        <TextInput
          style={styles.commentInput}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
  },
  commentText: {
    color: "#333",
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
  },
  viewAllCommentsText: {
    marginBottom: 10,
    color: "#666",
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#5E17EB",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 2,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600", 
    fontSize: 14, 
    textAlign: "center",
  },
});
