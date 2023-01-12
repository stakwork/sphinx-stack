




















admins = {
    
    "jigasi@auth.meet.jitsi",
    

    

    "focus@auth.meet.jitsi",
    "jvb@auth.meet.jitsi"
}

unlimited_jids = {
    "focus@auth.meet.jitsi",
    "jvb@auth.meet.jitsi"
}

plugin_paths = { "/prosody-plugins/", "/prosody-plugins-custom" }

muc_mapper_domain_base = "meet.jitsi";
muc_mapper_domain_prefix = "muc";

http_default_host = "meet.jitsi"









consider_bosh_secure = true;
consider_websocket_secure = true;



VirtualHost "meet.jitsi"

    authentication = "jitsi-anonymous"

    ssl = {
        key = "/config/certs/meet.jitsi.key";
        certificate = "/config/certs/meet.jitsi.crt";
    }
    modules_enabled = {
        "bosh";
        
        "websocket";
        "smacks"; -- XEP-0198: Stream Management
        
        "pubsub";
        "ping";
        "speakerstats";
        "conference_duration";
        
        "end_conference";
        
        
        
        "muc_lobby_rooms";
        
        
        "muc_breakout_rooms";
        
        
        "av_moderation";
        
        
        
        
    }

    main_muc = "muc.meet.jitsi"

    
    lobby_muc = "lobby.meet.jitsi"
    
    

    

    
    breakout_rooms_muc = "breakout.meet.jitsi"
    

    speakerstats_component = "speakerstats.meet.jitsi"
    conference_duration_component = "conferenceduration.meet.jitsi"

    
    end_conference_component = "endconference.<no value>"
    

    
    av_moderation_component = "avmoderation.meet.jitsi"
    

    c2s_require_encryption = false



VirtualHost "auth.meet.jitsi"
    ssl = {
        key = "/config/certs/auth.meet.jitsi.key";
        certificate = "/config/certs/auth.meet.jitsi.crt";
    }
    modules_enabled = {
        "limits_exception";
    }
    authentication = "internal_hashed"



Component "internal-muc.meet.jitsi" "muc"
    storage = "memory"
    modules_enabled = {
        "ping";
        }
    restrict_room_creation = true
    muc_room_locking = false
    muc_room_default_public_jids = true

Component "muc.meet.jitsi" "muc"
    storage = "memory"
    modules_enabled = {
        "muc_meeting_id";
        
        "polls";
        "muc_domain_mapper";
        
    }
    muc_room_cache_size = 1000
    muc_room_locking = false
    muc_room_default_public_jids = true
    

Component "focus.meet.jitsi" "client_proxy"
    target_address = "focus@auth.meet.jitsi"

Component "speakerstats.meet.jitsi" "speakerstats_component"
    muc_component = "muc.meet.jitsi"

Component "conferenceduration.meet.jitsi" "conference_duration_component"
    muc_component = "muc.meet.jitsi"


Component "endconference.<no value>" "end_conference"
    muc_component = "<no value>"



Component "avmoderation.meet.jitsi" "av_moderation_component"
    muc_component = "muc.meet.jitsi"



Component "lobby.meet.jitsi" "muc"
    storage = "memory"
    restrict_room_creation = true
    muc_room_locking = false
    muc_room_default_public_jids = true



Component "breakout.meet.jitsi" "muc"
    storage = "memory"
    restrict_room_creation = true
    muc_room_locking = false
    muc_room_default_public_jids = true
    modules_enabled = {
        "muc_meeting_id";
        "muc_domain_mapper";
        "polls";
        }

