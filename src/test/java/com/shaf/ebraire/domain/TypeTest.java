package com.shaf.ebraire.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.shaf.ebraire.web.rest.TestUtil;

public class TypeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Type.class);
        Type type1 = new Type();
        type1.setId(1L);
        Type type2 = new Type();
        type2.setId(type1.getId());
        assertThat(type1).isEqualTo(type2);
        type2.setId(2L);
        assertThat(type1).isNotEqualTo(type2);
        type1.setId(null);
        assertThat(type1).isNotEqualTo(type2);
    }
}
