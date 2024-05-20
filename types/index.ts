export {};

declare global {
    class User {
        id: number;
        username: string;
        image?: string;
        followed?: boolean;
        // banner?: string;
        // status?: string;
    }

    class Tweet {
        id: number;
        content: string;
        user: User;
        date: Date;
        likes: number;
        replies: number;
        retweets: number;
        retweetedBy?: string;
        hashtag?: string;
        image?: string;
        onlyFollowers?: boolean;
        liked?: boolean;
        saved?: boolean;
        retweeted?: boolean;
    }

    class Profile {
        id: number;
        username: string;
        following: number;
        followers: number;
        image?: string;
        banner?: string;
        status?: string;
        followed?: boolean;
    }
    class UserSettings extends User {
        banner?: string;
        status?: string
    }

    class Trend {
        name: string; // название тренда # автоматическая
        //tweets: Tweet[]; // твиты по этому хештегу тренду хз
        tweets: number; // количество твитов по этому тренду хз
    }
}