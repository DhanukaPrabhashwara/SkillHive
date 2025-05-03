package backend.controller;

import backend.exception.AchievementsNotFoundException;
import backend.model.AchievementsModel;
import backend.repository.AchievementsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@CrossOrigin("http://localhost:3000")
public class AchievementsController {
    @Autowired
    private AchievementsRepository achievementsRepository;
    private final Path root = Paths.get("uploads/achievementsPost");

    // Insert new achievement
    @PostMapping("/achievements")
    public AchievementsModel newAchievementsModel(@RequestBody AchievementsModel newAchievementsModel) {
        newAchievementsModel.setLikes(new ArrayList<>());
        newAchievementsModel.setComments(new ArrayList<>());
        newAchievementsModel.setBadges(new ArrayList<>());
        return achievementsRepository.save(newAchievementsModel);
    }

    // Upload image
    @PostMapping("/achievements/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String extension = file.getOriginalFilename()
                    .substring(file.getOriginalFilename().lastIndexOf("."));
            String filename = UUID.randomUUID() + extension;
            Files.copy(file.getInputStream(), this.root.resolve(filename));
            return filename;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    // Get all achievements
    @GetMapping("/achievements")
    List<AchievementsModel> getAll() {
        return achievementsRepository.findAll();
    }

    // Get achievement by ID
    @GetMapping("/achievements/{id}")
    AchievementsModel getById(@PathVariable String id) {
        return achievementsRepository.findById(id)
                .orElseThrow(() -> new AchievementsNotFoundException(id));
    }

    // Update achievement
    @PutMapping("/achievements/{id}")
    AchievementsModel update(@RequestBody AchievementsModel newAchievementsModel, @PathVariable String id) {
        return achievementsRepository.findById(id)
                .map(achievementsModel -> {
                    achievementsModel.setTitle(newAchievementsModel.getTitle());
                    achievementsModel.setDescription(newAchievementsModel.getDescription());
                    achievementsModel.setPostOwnerID(newAchievementsModel.getPostOwnerID());
                    achievementsModel.setPostOwnerName(newAchievementsModel.getPostOwnerName());
                    achievementsModel.setDate(newAchievementsModel.getDate());
                    achievementsModel.setCategory(newAchievementsModel.getCategory());
                    achievementsModel.setImageUrl(newAchievementsModel.getImageUrl());
                    achievementsModel.setLikes(newAchievementsModel.getLikes());
                    achievementsModel.setComments(newAchievementsModel.getComments());
                    achievementsModel.setBadges(assignBadges(newAchievementsModel));
                    return achievementsRepository.save(achievementsModel);
                }).orElseThrow(() -> new AchievementsNotFoundException(id));
    }

    // Delete achievement
    @DeleteMapping("/achievements/{id}")
    public void delete(@PathVariable String id) {
        achievementsRepository.deleteById(id);
    }

    // Get image
    @GetMapping("/achievements/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Error loading image: " + e.getMessage());
        }
    }

    // Like an achievement
    @PostMapping("/achievements/{id}/like")
    public AchievementsModel likeAchievement(@PathVariable String id, @RequestBody Map<String, String> body) {
        AchievementsModel achievement = achievementsRepository.findById(id)
                .orElseThrow(() -> new AchievementsNotFoundException(id));
        String userId = body.get("userId");
        if (!achievement.getLikes().contains(userId)) {
            achievement.getLikes().add(userId);
            achievementsRepository.save(achievement);
        }
        return achievement;
    }

    // Comment on an achievement
    @PostMapping("/achievements/{id}/comment")
    public AchievementsModel commentAchievement(@PathVariable String id, @RequestBody Map<String, String> body) {
        AchievementsModel achievement = achievementsRepository.findById(id)
                .orElseThrow(() -> new AchievementsNotFoundException(id));
        String userId = body.get("userId");
        String comment = body.get("comment");
        achievement.getComments().add(new AchievementsModel.Comment(userId, comment));
        achievementsRepository.save(achievement);
        return achievement;
    }

    // Assign badges based on achievement criteria
    private List<String> assignBadges(AchievementsModel achievement) {
        List<String> badges = new ArrayList<>(achievement.getBadges());
        if (achievement.getLikes().size() >= 10) {
            badges.add("Popular");
        }
        if (achievement.getComments().size() >= 5) {
            badges.add("Engaging");
        }
        return badges;
    }
}