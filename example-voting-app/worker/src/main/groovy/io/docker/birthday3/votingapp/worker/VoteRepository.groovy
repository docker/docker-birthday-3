package io.docker.birthday3.votingapp.worker

import org.springframework.data.repository.CrudRepository

interface VoteRepository extends CrudRepository<Vote, String> {}