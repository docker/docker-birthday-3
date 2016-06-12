package io.docker.birthday3.votingapp.worker

import com.fasterxml.jackson.annotation.JsonProperty

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name='votes')
class Vote {

    @Id
    @Column(name='id')
    @JsonProperty('voter_id')
    String voterId

    String vote

}
