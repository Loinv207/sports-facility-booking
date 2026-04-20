package com.sportsfacilitybooking.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.sportsfacilitybooking.backend.dto.ReviewRequest;
import com.sportsfacilitybooking.backend.dto.ReviewResponse;
import com.sportsfacilitybooking.backend.entity.Field;
import com.sportsfacilitybooking.backend.entity.Review;
import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.exception.BusinessException;
import com.sportsfacilitybooking.backend.exception.DuplicateResourceException;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.FieldRepository;
import com.sportsfacilitybooking.backend.repository.ReviewRepository;
import com.sportsfacilitybooking.backend.repository.UserRepository;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;

    public ReviewService(
        ReviewRepository reviewRepository,
        FieldRepository fieldRepository,
        UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.fieldRepository = fieldRepository;
        this.userRepository = userRepository;
    }

    public ReviewResponse createReview(String fieldId, ReviewRequest request, UserDetails userDetails) {
        if (userDetails == null) {
            throw new BusinessException("Ban can dang nhap de gui danh gia");
        }

        Field field = fieldRepository.findById(fieldId)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san voi id: " + fieldId));

        User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung dang nhap")));

        if (reviewRepository.existsByFieldIdAndUserId(fieldId, user.getId())) {
            throw new DuplicateResourceException("Ban da danh gia san nay roi");
        }

        Review review = new Review();
        review.setId(UUID.randomUUID().toString());
        review.setFieldId(fieldId);
        review.setUserId(user.getId());
        review.setRating(request.rating());
        review.setComment(request.comment().trim());
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);

        double averageRating = reviewRepository.findAverageRatingByFieldId(fieldId)
            .orElse((double) request.rating());

        field.setRating(
            BigDecimal.valueOf(averageRating)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue()
        );
        fieldRepository.save(field);

        return toResponse(savedReview, user.getUsername());
    }

    public List<ReviewResponse> getReviewsByFieldId(String fieldId) {
        fieldRepository.findById(fieldId)
            .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san voi id: " + fieldId));

        List<Review> reviews = reviewRepository.findByFieldIdOrderByCreatedAtDesc(fieldId);
        Map<Long, String> usernameById = userRepository.findAllById(
            reviews.stream()
                .map(Review::getUserId)
                .distinct()
                .toList()
        ).stream().collect(Collectors.toMap(User::getId, User::getUsername, (left, right) -> left));

        return reviews.stream()
            .map(review -> toResponse(review, usernameById.getOrDefault(review.getUserId(), "Unknown User")))
            .toList();
    }

    private ReviewResponse toResponse(Review review, String username) {
        return new ReviewResponse(
            review.getId(),
            review.getFieldId(),
            review.getUserId(),
            username,
            review.getRating(),
            review.getComment(),
            review.getCreatedAt()
        );
    }
}
