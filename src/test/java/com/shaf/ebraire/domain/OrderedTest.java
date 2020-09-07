package com.shaf.ebraire.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.shaf.ebraire.web.rest.TestUtil;

public class OrderedTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ordered.class);
        Ordered ordered1 = new Ordered();
        ordered1.setId(1L);
        Ordered ordered2 = new Ordered();
        ordered2.setId(ordered1.getId());
        assertThat(ordered1).isEqualTo(ordered2);
        ordered2.setId(2L);
        assertThat(ordered1).isNotEqualTo(ordered2);
        ordered1.setId(null);
        assertThat(ordered1).isNotEqualTo(ordered2);
    }
}
