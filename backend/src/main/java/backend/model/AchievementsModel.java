package backend.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "Achievements")
public class AchievementsModel {
    @Id
    @GeneratedValue
    private String id;
    private String postOwnerID;
    private String postOwnerName;
    private String title;
    private String description;
    private String date;
    private String category;
    private String imageUrl;
    private List<String> likes = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();
    private List<String> badges = new ArrayList<>();

    public static class Comment {
        private String userId;
        private String comment;

        public Comment() {}

        public Comment(String userId, String comment) {
            this.userId = userId;
            this.comment = comment;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }
    }

    public AchievementsModel() {}

    public AchievementsModel(String id, String postOwnerID, String postOwnerName, String title, String description, 
                           String date, String category, String imageUrl, List<String> likes, 
                           List<Comment> comments, List<String> badges) {
        this.id = id;
        this.postOwnerID = postOwnerID;
        this.postOwnerName = postOwnerName;
        this.title = title;
        this.description = description;
        this.date = date;
        this.category = category;
        this.imageUrl = imageUrl;
        this.likes = likes;
        this.comments = comments;
        this.badges = badges;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPostOwnerID() { return postOwnerID; }
    public void setPostOwnerID(String postOwnerID) { this.postOwnerID = postOwnerID; }
    public String getPostOwnerName() { return postOwnerName; }
    public void setPostOwnerName(String postOwnerName) { this.postOwnerName = postOwnerName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<String> getLikes() { return likes; }
    public void setLikes(List<String> likes) { this.likes = likes; }
    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
    public List<String> getBadges() { return badges; }
    public void setBadges(List<String> badges) { this.badges = badges; }
}