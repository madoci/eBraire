package com.shaf.ebraire.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.shaf.ebraire.web.rest.TestUtil;

public class BookedBookTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BookedBook.class);
        BookedBook bookedBook1 = new BookedBook();
        bookedBook1.setId(1L);
        BookedBook bookedBook2 = new BookedBook();
        bookedBook2.setId(bookedBook1.getId());
        assertThat(bookedBook1).isEqualTo(bookedBook2);
        bookedBook2.setId(2L);
        assertThat(bookedBook1).isNotEqualTo(bookedBook2);
        bookedBook1.setId(null);
        assertThat(bookedBook1).isNotEqualTo(bookedBook2);
    }
}
