const users = [
    {
        "name": "Sherman Reichert",
        "username": "Sherman_Reichert89",
        "email": "Sherman.Reichert@gmail.com",
        "dateofbirth": "1995-08-06",
        "avatar": "https://bit.ly/dan-abramov",
        "followers": [],
        "following": []
    },
    {
        "name": "Ollie Beier",
        "username": "Ollie.Beier",
        "email": "Ollie16@yahoo.com",
        "dateofbirth": "1999-03-14",
        "avatar": "https://bit.ly/tioluwani-kolawole",
        "followers": ['Sherman_Reichert89','Max_Grant4'],
        "following": ['Sherman_Reichert89','Max_Grant4', 'Terry_Kunze']

    },
    {
        "name": "Max Grant",
        "username": "Max_Grant4",
        "email": "Max_Grant@hotmail.com",
        "dateofbirth": "1991-05-10",
        "avatar": "https://bit.ly/kent-c-dodds",
        "followers": ['Sherman_Reichert89','Terry_Kunze', 'Max_Grant4', 'Ellen.Dicki'],
        "following": []
    },
    {
        "name": "Lila Prosacco",
        "username": "Lila.Prosacco",
        "email": "Lila_Prosacco@hotmail.com",
        "dateofbirth": "1994-07-09",
        "avatar": "https://bit.ly/ryan-florence",
        "followers": ['Max_Grant4'],
        "following": []
    },
    {
        "name": "Rosalie Runte",
        "username": "Rosalie_Runte",
        "email": "Rosalie36@hotmail.com",
        "dateofbirth": "1989-12-19",
        "avatar": "https://bit.ly/prosper-baba",
        "followers": ['Gary89'],
        "following": []
    },
    {
        "name": "Gary Schaden",
        "username": "Gary89",
        "email": "Gary48@gmail.com",
        "dateofbirth": "1984-12-26",
        "avatar": "https://bit.ly/code-beast",
        "followers": ['Rosalie_Runte'],
        "following": ['Gary89', 'Rosalie_Runte']
    },
    {
        "name": "Terry Kunze",
        "username": "Terry_Kunze",
        "email": "Terry_Kunze9@yahoo.com",
        "dateofbirth": "1999-10-02",
        "avatar": "https://bit.ly/sage-adebayo",
        "followers": ['Sherman_Reichert89','Doyle_Will21', 'Max_Grant4', 'Ellen.Dicki'],
        "following": ['Sherman_Reichert89','Doyle_Will21', 'Max_Grant4', 'Ellen.Dicki']
    },
    {
        "name": "Doyle Will",
        "username": "Doyle_Will21",
        "email": "Doyle.Will12@gmail.com",
        "dateofbirth": "1984-04-27",
        "avatar": "https://st.depositphotos.com/1969111/1847/i/450/depositphotos_18477899-stock-photo-black-cat.jpg",
        "followers": ['Max_Grant4'],
        "following": ['Sherman_Reichert89', 'Max_Grant4', 'Ellen.Dicki']
    },
]

export default users;