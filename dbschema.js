let db = {
    users: [
        {
            // basic
            userId: 'dh23ggj5h32g543j5gf43',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2019-03-15T10:59:52.798Z',
            imageUrl: 'image/dsfskfghsdsja/shda',
            // potional
            bio: 'Hello, my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'London, UK'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2020-07-01T20:09:04.864Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            screamId: 'kdsajfhjajshajsdjsaj',
            body: 'nice one mate!',
            createdAt: '2020-07-01T20:09:04.864Z'
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'john',
            read: 'true | false',
            screamId: 'dsfhajfhjskanda',
            type: 'like | comment',
            createdAt: '2020-07-01T20:09:04.864Z'
        }
    ]
};

const userDetails = {
    // Redux data
    credentials: {
        userId: 'NDIS2I321DSH21DY1S21MALOQMNC',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2019-03-15T10:59:52.798Z',
        imageUrl: 'image/dsfskfghsdsja/shda',
        bio: 'Hello, my name is user, nice to meet you',
        website: 'https://user.com',
        location: 'London, UK'
    },

    likes: [
        {
            userHandle: 'user',
            screamId: 'hh705wdjH732HHJD8'
        },
        {
            userHandle: 'user',
            screamId: 'hdsjaj7821hjdsD80'
        }
    ]
}