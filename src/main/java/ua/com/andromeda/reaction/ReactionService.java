package ua.com.andromeda.reaction;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.com.andromeda.comment.Comment;
import ua.com.andromeda.comment.CommentNotFoundException;
import ua.com.andromeda.comment.CommentRepository;
import ua.com.andromeda.common.UserNotAuthenticatedException;

import java.security.Principal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReactionService {
    private final ReactionRepository reactionRepository;
    private final CommentRepository commentRepository;

    public void save(ReactionType reactionType, Principal principal, String commentId) {
        checkPrincipal(principal);
        Comment comment = getComment(commentId);
        Reaction reaction = new Reaction(principal.getName(), reactionType, comment);
        reactionRepository.save(reaction);
    }

    private void checkPrincipal(Principal principal) {
        if (principal == null) {
            throw new UserNotAuthenticatedException();
        }
    }

    private Comment getComment(String id) {
        return commentRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new CommentNotFoundException(id));
    }

    @Transactional
    public void delete(Principal principal, String commentId) {
        checkPrincipal(principal);
        Comment comment = getComment(commentId);
        comment.getReactions().removeIf(reaction -> reaction.getUsername().equals(principal.getName()));
        reactionRepository.deleteByUsernameAndCommentId(principal.getName(), UUID.fromString(commentId));
    }

    public void update(ReactionType reactionType, Principal principal, String commentId) {
        Reaction reaction = getReaction(principal, commentId);
        reaction.setType(reactionType);
        reactionRepository.save(reaction);
    }

    private Reaction getReaction(Principal principal, String commentId) {
        checkPrincipal(principal);
        Comment comment = getComment(commentId);
        String username = principal.getName();
        return reactionRepository.findByUsernameAndComment(username, comment)
                .orElseThrow(() -> new ReactionNotFoundException("Cannot find reaction of comment with id=" + "'" + commentId + "'" + " by user"));
    }
}