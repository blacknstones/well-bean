package se.kth.sda.wellbean.calendar;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import se.kth.sda.wellbean.auth.AuthService;
import se.kth.sda.wellbean.user.User;
import se.kth.sda.wellbean.user.UserRepository;
import se.kth.sda.wellbean.user.UserService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    private final EventRepository eventRepository;
    private final UserService userService;
    private final AuthService authService;

    public EventController(EventRepository eventRepository,
                           UserService userService,
                           AuthService authService) {
        this.eventRepository = eventRepository;
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/")
    public List<Event> events(){
        return eventRepository.findAll();
    }

    /**
     * /events/1/range?start=2020-12-02&end=2020-12-03
     * @param userId
     * @param start
     * @param end
     * @return
     * @throws BadDateFormatException
     */
    @GetMapping("{userId}/range")
    public List<Event> getEventsInRange(@PathVariable Long userId,
                                        @RequestParam(value = "start", required = true) String start,
                                        @RequestParam(value = "end", required = true) String end) throws BadDateFormatException {
        Date startDate = null;
        Date endDate = null;
        SimpleDateFormat inputDateFormat=new SimpleDateFormat("yyyy-MM-dd");

        try {
            startDate = inputDateFormat.parse(start);
        } catch (ParseException e) {
            throw new BadDateFormatException("bad start date: " + start);
        }

        try {
            endDate = inputDateFormat.parse(end);
        } catch (ParseException e) {
            throw new BadDateFormatException("bad end date: " + end);
        }

        LocalDateTime startDateTime = LocalDateTime.ofInstant(startDate.toInstant(),
                ZoneId.systemDefault());

        LocalDateTime endDateTime = LocalDateTime.ofInstant(endDate.toInstant(),
                ZoneId.systemDefault());

        User user = userService.findById(userId);

        List<Event> eventsInTimeScope = eventRepository.findByDateBetween(startDateTime, endDateTime);

        List<Event> userEventsInTimeScope = new ArrayList<>();
        for(Event event : eventsInTimeScope) {
            if(event.getUsers().contains(user)){
                userEventsInTimeScope.add(event);
            }
        }

        return userEventsInTimeScope;
    }

    @PostMapping("")
    public Event create(@RequestBody Event event) {
        String creatorEmail = authService.getLoggedInUserEmail();
        User creator = userService.findUserByEmail(creatorEmail);
        event.setCreator(creator);
        event.addMember(creator);
        return eventRepository.save(event);
    }

    @PutMapping("")
    public Event update(@RequestBody Event event) {
        if(checkCredentials(event)){
            return eventRepository.save(event);
        } else {
            throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
        }
    }

    @PutMapping("/{eventId}/userEmail")
    public Event inviteUserByEmail(@PathVariable Long eventId, @RequestParam String userEmail) {
        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND)
        );
        if(checkCredentials(event)){
            User user = userService.findUserByEmail(userEmail);
            event.addMember(user);
            return eventRepository.save(event);
        } else {
            throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
        }
    }

    @DeleteMapping("")
    public void delete(Event event) {
        if(checkCredentials(event)){
            eventRepository.delete(event);
        } else {
            throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
        }
    }

    private boolean checkCredentials(Event event) {
        String creatorEmail = event.getCreator().getEmail();
        String currentUserEmail = authService.getLoggedInUserEmail();
        return creatorEmail.equals(currentUserEmail);
    }
}