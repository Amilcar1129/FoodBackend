def commit_callback(commit):
    # Si el commit NO es tuyo, cámbialo
    if commit.author_email != b"pintadoamilcar2001@gmail.com":
        commit.author_name = b"Amilcar"
        commit.author_email = b"pintadoamilcar2001@gmail.com"
        commit.committer_name = b"Amilcar"
        commit.committer_email = b"amilcar@espam.com"
